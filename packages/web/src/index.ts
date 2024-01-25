export const schema_data: any = await fetch('http://localhost:3077/schema-data').then((res) =>
  res.json()
)
