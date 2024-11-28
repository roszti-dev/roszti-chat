"use server";

export async function getFileData(file: File) {
  const data = await file.arrayBuffer();
  return data;
}
