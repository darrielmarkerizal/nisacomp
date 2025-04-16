import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const sort = searchParams.get("sort") || "generic_name";
  const order = searchParams.get("order") || "asc";
  const search = searchParams.get("search") || "";

  try {
    const skip = (page - 1) * limit;
    let url = `https://api.fda.gov/drug/label.json?limit=${limit}&skip=${skip}`;
    if (search) {
      url += `&search=(openfda.generic_name:"${encodeURIComponent(search)}"+openfda.brand_name:"${encodeURIComponent(search)}")`;
    }

    const openfdaRes = await axios.get(url);
    const drugs =
      openfdaRes.data.results?.map((drug) => ({
        name:
          drug.openfda?.generic_name?.[0] ||
          drug.openfda?.brand_name?.[0] ||
          "Unknown",
        genericName: drug.openfda?.generic_name?.[0] || "N/A",
        brandName: drug.openfda?.brand_name?.[0] || "N/A",
        manufacturer: drug.openfda?.manufacturer_name?.[0] || "N/A",
      })) || [];
    const total = openfdaRes.data.meta?.results?.total || 0;

    return NextResponse.json({ drugs, total, page, limit });
  } catch (error) {
    console.error("Error fetching drugs:", error.message);
    return NextResponse.json(
      { error: "Error fetching drugs" },
      { status: 500 }
    );
  }
}
