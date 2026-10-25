import os, sys, tempfile
_dir = tempfile.mkdtemp()
os.environ["ENVIRONMENT"] = "development"
os.environ["DATABASE_URL"] = f"sqlite:///{_dir}/test.db"
os.environ["APP_SECRET"] = "t" * 48
os.environ["REQUIRE_FARMER_VERIFICATION"] = "false"
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
