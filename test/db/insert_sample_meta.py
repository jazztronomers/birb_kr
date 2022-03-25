template = {
    "content_id": content_id,
    "publish_timestamp": publish_timestamp,
    "observe_timestamp": meta.get("observe_timestamp", publish_timestamp),
    "camera": meta.get("camera"),
    "lens": meta.get("lens"),
    "object_key": object_key,
    "x": float(meta.get('x', round(uniform(124, 128), 7))),
    "y": float(meta.get('y', round(uniform(36, 38), 7))),
    "species": bids
}