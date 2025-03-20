
-- Function to run SQL commands from the frontend
CREATE OR REPLACE FUNCTION public.run_sql(query text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only allow certain SQL commands for safety
  IF NOT (
    query ILIKE 'CREATE TABLE%' OR 
    query ILIKE 'ALTER TABLE%' OR 
    query ILIKE 'DROP TABLE%' OR
    query ILIKE 'CREATE INDEX%' OR
    query ILIKE 'DROP INDEX%' OR
    query ILIKE 'CREATE POLICY%' OR
    query ILIKE 'DROP POLICY%' OR
    query ILIKE 'GRANT%' OR
    query ILIKE 'REVOKE%'
  ) THEN
    RAISE EXCEPTION 'Unauthorized SQL command: %', query;
  END IF;
  
  -- Execute the query
  EXECUTE query;
  
  RETURN jsonb_build_object('success', true);
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- Function to get all tables in a schema
CREATE OR REPLACE FUNCTION public.get_tables()
RETURNS TABLE (name text, schema text)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    table_name::text, 
    table_schema::text
  FROM 
    information_schema.tables
  WHERE 
    table_type = 'BASE TABLE'
  ORDER BY 
    table_schema, 
    table_name;
END;
$$;

-- Function to get columns for a table
CREATE OR REPLACE FUNCTION public.get_table_columns()
RETURNS TABLE (
  name text,
  data_type text,
  is_nullable boolean,
  column_default text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    column_name::text,
    data_type::text,
    (is_nullable = 'YES')::boolean,
    column_default::text
  FROM 
    information_schema.columns
  WHERE 
    table_schema = current_setting('request.jwt.claims', true)::json->>'role'
  ORDER BY 
    ordinal_position;
END;
$$;
