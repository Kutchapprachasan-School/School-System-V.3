async function check() {
  const urls = [
    "https://school-system-v3.vercel.app/login",
    "https://school-system-v3.vercel.app/dashboard",
    "https://school-system-v3.vercel.app/api/health"
  ];

  console.log("Checking deployment health...");
  for (const url of urls) {
    try {
      const res = await fetch(url, { redirect: "manual" });
      console.log(`URL: ${url}`);
      console.log(`Status: ${res.status}`);
      console.log(`Headers Location: ${res.headers.get("location")}`);
      console.log("-----------------------------------------");
    } catch (err: any) {
      console.error(`Failed to fetch ${url}:`, err.message);
    }
  }
}

check();
