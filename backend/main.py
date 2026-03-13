from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
from datetime import datetime, timedelta, timezone

app = FastAPI(title="Wind Forecast Monitor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

ELEXON_BASE = "https://data.elexon.co.uk/bmrs/api/v1"


def parse_dt(s):
    if not s:
        return None
    try:
        dt = datetime.fromisoformat(s.replace("Z", "+00:00"))
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt
    except Exception:
        return None


async def fetch_once(client, url, params):
    try:
        resp = await client.get(url, params=params, timeout=20)
        if resp.status_code != 200:
            return []
        raw = resp.json()
        if isinstance(raw, list):
            return raw
        if isinstance(raw, dict):
            return raw.get("data", [])
        return []
    except Exception:
        return []


@app.get("/api/actuals")
async def get_actuals(
    start: str = Query(...),
    end: str = Query(...),
):
    try:
        start_dt = parse_dt(start)
        end_dt = parse_dt(end)

        async with httpx.AsyncClient() as client:
            params = {
                "settlementDateFrom": start[:10],
                "settlementDateTo": end[:10],
                "fuelType": "WIND",
                "format": "json",
                "pageSize": 500,
                "page": 1,
            }
            items = await fetch_once(client, f"{ELEXON_BASE}/datasets/FUELHH/stream", params)

        results = []
        for item in items:
            if item.get("fuelType") != "WIND":
                continue
            dt = parse_dt(item.get("startTime") or item.get("settlementDate"))
            if dt and start_dt <= dt <= end_dt:
                results.append({
                    "startTime": dt.isoformat(),
                    "generation": item.get("generation", 0),
                })

        results.sort(key=lambda x: x["startTime"])
        return {"data": results}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/forecasts")
async def get_forecasts(
    start: str = Query(...),
    end: str = Query(...),
    horizon_hours: float = Query(4.0),
):
    try:
        start_dt = parse_dt(start)
        end_dt = parse_dt(end)

        fetch_from = (start_dt - timedelta(hours=48)).strftime("%Y-%m-%dT%H:%M:%SZ")
        fetch_to = end_dt.strftime("%Y-%m-%dT%H:%M:%SZ")

        async with httpx.AsyncClient() as client:
            params = {
                "publishDateTimeFrom": fetch_from,
                "publishDateTimeTo": fetch_to,
                "format": "json",
                "pageSize": 500,
                "page": 1,
            }
            items = await fetch_once(client, f"{ELEXON_BASE}/datasets/WINDFOR/stream", params)

        forecasts_by_target = {}
        for item in items:
            target_dt = parse_dt(item.get("startTime"))
            publish_dt = parse_dt(item.get("publishTime"))
            if not target_dt or not publish_dt:
                continue
            if not (start_dt <= target_dt <= end_dt):
                continue
            diff = (target_dt - publish_dt).total_seconds() / 3600
            if diff < horizon_hours or diff > 48:
                continue

            key = target_dt.isoformat()
            if key not in forecasts_by_target or publish_dt > forecasts_by_target[key]["publishTime"]:
                forecasts_by_target[key] = {
                    "publishTime": publish_dt,
                    "generation": item.get("generation", 0),
                }

        results = [
            {
                "startTime": k,
                "generation": v["generation"],
                "publishTime": v["publishTime"].isoformat(),
            }
            for k, v in forecasts_by_target.items()
        ]
        results.sort(key=lambda x: x["startTime"])
        return {"data": results}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
def health():
    return {"status": "ok"}