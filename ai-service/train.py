import unsloth

from unsloth import FastLanguageModel

import torch
from datasets import Dataset
from trl import SFTTrainer, SFTConfig

import json
from pathlib import Path


# ============================================================
# ForenX AI - Phase 1 Fine-Tuning
# ============================================================

BASE_DIR = Path(__file__).parent
DATASET_DIR = BASE_DIR / "dataset"
OUTPUT_DIR = BASE_DIR / "models" / "forenx-ai-phase1"

MODEL_NAME = "unsloth/Qwen3-4B-bnb-4bit"

MAX_SEQ_LENGTH = 1024


# ============================================================
# 1. Load all JSONL dataset files
# ============================================================

def load_dataset_files():
    examples = []

    files = sorted(DATASET_DIR.glob("*.jsonl"))

    if not files:
        raise FileNotFoundError(
            f"No JSONL files found in {DATASET_DIR}"
        )

    print("=" * 60)
    print("Loading ForenX AI Dataset")
    print("=" * 60)

    for file in files:
        file_count = 0

        with file.open("r", encoding="utf-8") as f:
            for line_number, line in enumerate(f, start=1):

                line = line.strip()

                if not line:
                    continue

                try:
                    data = json.loads(line)
                except json.JSONDecodeError as error:
                    raise ValueError(
                        f"Invalid JSON in {file.name}, "
                        f"line {line_number}: {error}"
                    )

                required = ["instruction", "input", "output"]

                for field in required:
                    if field not in data:
                        raise ValueError(
                            f"Missing '{field}' in "
                            f"{file.name}, line {line_number}"
                        )

                examples.append(data)
                file_count += 1

        print(f"  {file.name}: {file_count} examples")

    print("-" * 60)
    print(f"Total examples: {len(examples)}")
    print("=" * 60)

    return examples


# ============================================================
# 2. Format examples for Qwen3
# ============================================================

def format_example(example):
    instruction = example["instruction"].strip()
    user_input = example["input"].strip()
    output = example["output"].strip()

    user_content = instruction

    if user_input:
        user_content += f"\n\nInput:\n{user_input}"

    return {
        "text": (
            "<|im_start|>user\n"
            f"{user_content}\n"
            "<|im_end|>\n"
            "<|im_start|>assistant\n"
            f"{output}\n"
            "<|im_end|>"
        )
    }


# ============================================================
# 3. Main training process
# ============================================================

def main():

    print("\n" + "=" * 60)
    print("FORENX AI - PHASE 1 FINE-TUNING")
    print("=" * 60)

    print("\nChecking GPU...")

    if not torch.cuda.is_available():
        raise RuntimeError(
            "CUDA is not available. "
            "Training requires the NVIDIA GPU."
        )

    print("GPU:", torch.cuda.get_device_name(0))

    gpu_memory = torch.cuda.get_device_properties(0).total_memory

    print(
        "GPU VRAM:",
        round(gpu_memory / 1024**3, 2),
        "GB"
    )

    # --------------------------------------------------------
    # Load dataset
    # --------------------------------------------------------

    raw_examples = load_dataset_files()

    formatted_examples = [
        format_example(example)
        for example in raw_examples
    ]

    dataset = Dataset.from_list(formatted_examples)

    # --------------------------------------------------------
    # Shuffle dataset
    # --------------------------------------------------------

    dataset = dataset.shuffle(seed=42)

    print("\nDataset prepared successfully.")
    print("Training examples:", len(dataset))

    # --------------------------------------------------------
    # Load Qwen3-4B 4-bit
    # --------------------------------------------------------

    print("\nLoading Qwen3-4B 4-bit model...")

    model, tokenizer = FastLanguageModel.from_pretrained(
        model_name=MODEL_NAME,
        max_seq_length=MAX_SEQ_LENGTH,
        load_in_4bit=True,
        dtype=None,
    )

    print("✅ Model loaded.")

    # --------------------------------------------------------
    # Configure LoRA
    # --------------------------------------------------------

    print("\nConfiguring QLoRA...")

    model = FastLanguageModel.get_peft_model(
        model,

        r=8,

        target_modules=[
            "q_proj",
            "k_proj",
            "v_proj",
            "o_proj",
            "gate_proj",
            "up_proj",
            "down_proj",
        ],

        lora_alpha=16,

        lora_dropout=0,

        bias="none",

        use_gradient_checkpointing="unsloth",

        random_state=42,

        use_rslora=False,

        loftq_config=None,
    )

    print("✅ QLoRA configured.")

    # --------------------------------------------------------
    # Create output directory
    # --------------------------------------------------------

    OUTPUT_DIR.mkdir(
        parents=True,
        exist_ok=True
    )

    # --------------------------------------------------------
    # Training configuration
    # --------------------------------------------------------

    training_args = SFTConfig(

        output_dir=str(OUTPUT_DIR),

        # Memory-saving settings
        per_device_train_batch_size=1,
        gradient_accumulation_steps=8,

        # Training duration
        num_train_epochs=3,

        # Learning rate
        learning_rate=2e-4,

        # Optimization
        optim="paged_adamw_8bit",

        # Precision
        fp16=False,
        bf16=True,

        # Logging
        logging_steps=1,

        # Saving
        save_strategy="epoch",
        save_total_limit=2,

        # Dataset
        dataset_text_field="text",
        max_length=MAX_SEQ_LENGTH,

        # Performance
        gradient_checkpointing=True,

        # Reproducibility
        seed=42,

        report_to="none",

        # Disable unnecessary evaluation
        eval_strategy="no",
    )

    # --------------------------------------------------------
    # Trainer
    # --------------------------------------------------------

    print("\nCreating trainer...")

    trainer = SFTTrainer(
        model=model,
        processing_class=tokenizer,
        train_dataset=dataset,
        args=training_args,
    )

    print("✅ Trainer ready.")

    # --------------------------------------------------------
    # Start training
    # --------------------------------------------------------

    print("\n" + "=" * 60)
    print("STARTING FORENX AI TRAINING")
    print("=" * 60)

    print("\nThis may take some time on the RTX 3050.")
    print("Do not close the terminal while training.\n")

    trainer_stats = trainer.train()

    # --------------------------------------------------------
    # Save adapter
    # --------------------------------------------------------

    print("\n" + "=" * 60)
    print("TRAINING COMPLETE")
    print("=" * 60)

    print("\nSaving ForenX AI adapter...")

    model.save_pretrained(str(OUTPUT_DIR))
    tokenizer.save_pretrained(str(OUTPUT_DIR))

    print("\n✅ ForenX AI adapter saved to:")

    print(OUTPUT_DIR)

    print("\nTraining statistics:")

    print(
        "Training loss:",
        trainer_stats.training_loss
    )

    print(
        "Training steps:",
        trainer_stats.global_step
    )

    print("\n" + "=" * 60)
    print("PHASE 1 TRAINING MODEL SAVED")
    print("=" * 60)


if __name__ == "__main__":
    main()