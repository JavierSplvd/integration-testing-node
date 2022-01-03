# integration-testing-node
This is a proof of concept to find a way of setting up a integration environment to do integration tests. There is a Postgres database defined on a docker compose file that is built at the start of the test and is teared down after all the tests have run.

The database initial state is defined on the "/scriopts/init-db.sql" file, so it should represent the schema on production.
