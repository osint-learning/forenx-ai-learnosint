from unsloth import FastLanguageModel
import torch

MODEL_NAME = "unsloth/Qwen3-4B-bnb-4bit"

print("=" * 60)
print("ForenX AI - Model Loading Test")
print("=" * 60)

print("\nLoading Qwen3-4B 4-bit Unsloth model...")

model, tokenizer = FastLanguageModel.from_pretrained(
    model_name=MODEL_NAME,
    max_seq_length=1024,
    load_in_4bit=True,
    dtype=None,
)

print("\n✅ Model loaded successfully!")

print("Model:", MODEL_NAME)
print("CUDA available:", torch.cuda.is_available())

if torch.cuda.is_available():
    print("GPU:", torch.cuda.get_device_name(0))

    print(
        "GPU memory allocated:",
        round(torch.cuda.memory_allocated() / 1024**3, 2),
        "GB"
    )

    print(
        "GPU memory reserved:",
        round(torch.cuda.memory_reserved() / 1024**3, 2),
        "GB"
    )

print("Tokenizer loaded:", tokenizer is not None)

print("\n" + "=" * 60)
print("MODEL TEST PASSED")
print("=" * 60)