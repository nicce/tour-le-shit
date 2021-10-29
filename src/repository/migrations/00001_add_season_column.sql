ALTER TABLE score ADD COLUMN season INTEGER;
UPDATE score set season = 1;
ALTER TABLE score ALTER COLUMN season SET NOT NULL;

ALTER TABLE scoreboard ADD COLUMN season INTEGER;
UPDATE scoreboard set season = 1;
ALTER TABLE scoreboard ALTER COLUMN season SET NOT NULL;