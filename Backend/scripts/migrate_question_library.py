"""One-off migration for question library duplicate detection."""
from __future__ import annotations

from pathlib import Path

import pymysql


def load_env(path: Path) -> dict[str, str]:
    env: dict[str, str] = {}
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        env[key.strip()] = value.strip()
    return env


def main() -> None:
    root = Path(__file__).resolve().parents[2]
    env = load_env(root / ".env")
    conn = pymysql.connect(
        host=env["MYSQL_HOST"],
        port=int(env["MYSQL_PORT"]),
        user=env["MYSQL_USER"],
        password=env["MYSQL_PASSWORD"],
        database=env["MYSQL_DATABASE"],
        ssl={"ssl": {}},
    )
    cur = conn.cursor()
    statements = [
        "ALTER TABLE question ADD COLUMN content_hash VARCHAR(64) NULL AFTER content",
        "ALTER TABLE question ADD COLUMN duplicate_warning VARCHAR(255) NULL AFTER content_hash",
        """
        CREATE TABLE IF NOT EXISTS tag (
            id BIGINT NOT NULL AUTO_INCREMENT,
            name VARCHAR(100) NOT NULL,
            PRIMARY KEY (id),
            UNIQUE KEY uk_tag_name (name)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        """,
    ]
    for statement in statements:
        try:
            cur.execute(statement)
            print("OK")
        except Exception as error:  # noqa: BLE001
            print("SKIP", error)
    conn.commit()
    conn.close()
    print("Migration finished")


if __name__ == "__main__":
    main()
