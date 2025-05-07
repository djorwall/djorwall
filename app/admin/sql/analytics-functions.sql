-- Function to get users by role
CREATE OR REPLACE FUNCTION get_users_by_role()
RETURNS TABLE (
  role TEXT,
  count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT u.role::TEXT, COUNT(*)::BIGINT
  FROM users u
  GROUP BY u.role
  ORDER BY count DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get sheets by access type
CREATE OR REPLACE FUNCTION get_sheets_by_access_type()
RETURNS TABLE (
  access_type TEXT,
  count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT s.access_type::TEXT, COUNT(*)::BIGINT
  FROM influencer_sheets s
  GROUP BY s.access_type
  ORDER BY count DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get views by month
CREATE OR REPLACE FUNCTION get_views_by_month()
RETURNS TABLE (
  month TEXT,
  count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    TO_CHAR(v.viewed_at, 'YYYY-MM') as month,
    COUNT(*)::BIGINT
  FROM sheet_views v
  GROUP BY month
  ORDER BY month;
END;
$$ LANGUAGE plpgsql;

-- Function to get top viewed sheets
CREATE OR REPLACE FUNCTION get_top_viewed_sheets(limit_num INTEGER)
RETURNS TABLE (
  id UUID,
  name TEXT,
  view_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.name,
    COUNT(v.id)::BIGINT as view_count
  FROM influencer_sheets s
  JOIN sheet_views v ON s.id = v.sheet_id
  GROUP BY s.id, s.name
  ORDER BY view_count DESC
  LIMIT limit_num;
END;
$$ LANGUAGE plpgsql;

-- Function to get user growth by month
CREATE OR REPLACE FUNCTION get_user_growth_by_month()
RETURNS TABLE (
  month TEXT,
  count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    TO_CHAR(u.created_at, 'YYYY-MM') as month,
    COUNT(*)::BIGINT
  FROM users u
  GROUP BY month
  ORDER BY month;
END;
$$ LANGUAGE plpgsql;

-- Function to get influencer platform distribution
CREATE OR REPLACE FUNCTION get_influencer_platform_distribution()
RETURNS TABLE (
  platform TEXT,
  count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    i.platform::TEXT,
    COUNT(*)::BIGINT
  FROM influencers i
  GROUP BY i.platform
  ORDER BY count DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get engagement rate distribution
CREATE OR REPLACE FUNCTION get_engagement_rate_distribution()
RETURNS TABLE (
  range TEXT,
  count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    CASE
      WHEN REPLACE(i.engagement, '%', '')::NUMERIC < 1 THEN '0-1%'
      WHEN REPLACE(i.engagement, '%', '')::NUMERIC < 2 THEN '1-2%'
      WHEN REPLACE(i.engagement, '%', '')::NUMERIC < 3 THEN '2-3%'
      WHEN REPLACE(i.engagement, '%', '')::NUMERIC < 4 THEN '3-4%'
      WHEN REPLACE(i.engagement, '%', '')::NUMERIC < 5 THEN '4-5%'
      ELSE '5%+'
    END as range,
    COUNT(*)::BIGINT
  FROM influencers i
  GROUP BY range
  ORDER BY 
    CASE range
      WHEN '0-1%' THEN 1
      WHEN '1-2%' THEN 2
      WHEN '2-3%' THEN 3
      WHEN '3-4%' THEN 4
      WHEN '4-5%' THEN 5
      WHEN '5%+' THEN 6
      ELSE 7
    END;
END;
$$ LANGUAGE plpgsql;
