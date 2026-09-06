import json
from pathlib import Path

DATASET_DIR = Path(__file__).parent / "dataset"

required_fields = {
    "instruction",
    "input",
    "output"
}

files = sorted(DATASET_DIR.glob("*.jsonl"))

if not files:
    print("❌ No JSONL files found.")
    exit(1)

total_examples = 0
all_valid = True

print("=" * 60)
print("ForenX AI Dataset Validation")
print("=" * 60)

for file in files:
    print(f"\nChecking: {file.name}")

    file_examples = 0

    try:
        with file.open("r", encoding="utf-8") as f:

            for line_number, line in enumerate(f, start=1):

                line = line.strip()

                if not line:
                    continue

                try:
                    data = json.loads(line)
                except json.JSONDecodeError as error:
                    print(
                        f"❌ Invalid JSON at line {line_number}: "
                        f"{error}"
                    )
                    all_valid = False
                    continue

                if not isinstance(data, dict):
                    print(
                        f"❌ Line {line_number} is not a JSON object."
                    )
                    all_valid = False
                    continue

                missing = required_fields - data.keys()

                if missing:
                    print(
                        f"❌ Line {line_number} is missing fields: "
                        f"{', '.join(sorted(missing))}"
                    )
                    all_valid = False
                    continue

                if not isinstance(data["instruction"], str):
                    print(
                        f"❌ Line {line_number}: "
                        "'instruction' must be a string."
                    )
                    all_valid = False

                if not isinstance(data["input"], str):
                    print(
                        f"❌ Line {line_number}: "
                        "'input' must be a string."
                    )
                    all_valid = False

                if not isinstance(data["output"], str):
                    print(
                        f"❌ Line {line_number}: "
                        "'output' must be a string."
                    )
                    all_valid = False

                file_examples += 1
                total_examples += 1

        print(f"✅ {file_examples} examples found.")

    except Exception as error:
        print(f"❌ Could not read file: {error}")
        all_valid = False


print("\n" + "=" * 60)
print(f"Total examples: {total_examples}")

if all_valid:
    print("✅ DATASET VALIDATION PASSED")
    print("All JSONL files are correctly formatted.")
else:
    print("❌ DATASET VALIDATION FAILED")
    print("Fix the errors above before training.")

print("=" * 60)

if not all_valid:
    exit(1)