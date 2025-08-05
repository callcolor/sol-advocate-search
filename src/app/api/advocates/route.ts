import { NextRequest } from "next/server";
import db from "../../../db";
import { advocates } from "../../../db/schema";
import { desc, and, gte, like, eq, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const firstName = searchParams.get('firstName');
  const lastName = searchParams.get('lastName');
  const city = searchParams.get('city');
  const degree = searchParams.get('degree');
  const specialties = searchParams.getAll('specialties');
  const yearsOfExperience = searchParams.get('yearsOfExperience');
  const limit = Number(searchParams.get('limit')) || 10;
  const offset = Number(searchParams.get('offset')) || 0;

  const filters = [];
  if (firstName) {
    filters.push(like(advocates.firstName, firstName))
  }
  if (lastName) {
    filters.push(like(advocates.lastName, lastName))
  }
  if (city) {
    filters.push(like(advocates.city, city))
  }
  if (degree) {
    filters.push(eq(advocates.degree, degree))
  }
  if (yearsOfExperience) {
    filters.push(gte(advocates.yearsOfExperience, Number(yearsOfExperience)))
  }
  if (specialties) {
    const specialtiesArray = JSON.stringify(specialties);
    filters.push(sql`payload @> ${specialtiesArray}`)
  }

  const data = await db.
    select()
    .from(advocates)
    .where(and(...filters))
    .orderBy(desc(advocates.yearsOfExperience))
    .limit(limit)
    .offset(offset);

  return Response.json({ data });
}
