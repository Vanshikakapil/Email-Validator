import json
from datetime import datetime
import os

LOG_FILE = "logs.json"

def write_log(admin_email: str, action: str):
    log_entry = {
        "admin": admin_email,
        "action": action,
        "timestamp": datetime.utcnow().isoformat()
    }

    if not os.path.exists(LOG_FILE):
        logs = []
    else:
        with open(LOG_FILE, "r") as f:
            logs = json.load(f)

    logs.append(log_entry)

    with open(LOG_FILE, "w") as f:
        json.dump(logs, f, indent=2)
