"""Inspect quiz-related schema and sample data."""
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

    cur.execute("SHOW TABLES LIKE '%quiz%'")
    print("TABLES:", cur.fetchall())

    for table in ["Quiz", "quiz", "quizQuestion"]:
        try:
            cur.execute(f"DESCRIBE `{table}`")
            print(f"\n=== {table} ===")
            for row in cur.fetchall():
                print(row)
        except Exception as error:  # noqa: BLE001
            print(f"\n=== {table} missing ===", error)

    cur.execute("SELECT id, title, subject_id FROM chapter")
    print("\nCHAPTERS:", repr(cur.fetchall()))

    cur.execute(
        """
        SELECT l.id, l.title, c.title, s.title
        FROM lesson l
        LEFT JOIN chapter c ON l.chapter_id = c.id
        LEFT JOIN subject s ON c.subject_id = s.id
        """
    )
    print("LESSONS:", repr(cur.fetchall()))

    cur.execute("SELECT status, COUNT(1) FROM question GROUP BY status")
    print("QUESTION STATUS:", cur.fetchall())

    for table in ["quiz_attempt", "quiz_attempt_detail"]:
        cur.execute(f"DESCRIBE `{table}`")
        print(f"\n=== {table} ===")
        for row in cur.fetchall():
            print(row)
        cur.execute(f"SELECT COUNT(1) FROM `{table}`")
        print("COUNT:", cur.fetchone()[0])

    cur.execute("SELECT COUNT(1) FROM quiz")
    print("\nQUIZ COUNT:", cur.fetchone()[0])
    cur.execute("SELECT id, title, time_limit, lesson_id FROM quiz LIMIT 10")
    print("QUIZ ROWS:", cur.fetchall())

    cur.execute("SELECT COUNT(1) FROM question WHERE quiz_id IS NOT NULL")
    row = cur.fetchone()
    print("QUESTIONS WITH quiz_id:", row[0] if row else 0)

    cur.execute(
        """
        SELECT q.id, LEFT(q.title, 40), l.id, c.id, s.id
        FROM question q
        JOIN lesson l ON q.lesson_id = l.id
        JOIN chapter c ON l.chapter_id = c.id
        JOIN subject s ON c.subject_id = s.id
        WHERE q.status = 'PUBLISHED'
        ORDER BY q.id
        """
    )
    print("PUBLISHED QUESTION IDS:", cur.fetchall())

    conn.close()


if __name__ == "__main__":
    main()
