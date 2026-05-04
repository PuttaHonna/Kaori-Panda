import sys
import subprocess

def install_and_download():
    try:
        import kagglehub
    except ImportError:
        print("Installing kagglehub...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "kagglehub"])
        import kagglehub

    print("Downloading dataset...")
    path = kagglehub.dataset_download("robinpourtaud/jlpt-words-by-level")
    print(f"DOWNLOAD_PATH_RESULT:{path}")

if __name__ == "__main__":
    install_and_download()
