# Serverless SQL Lifecycle Management

- [Serverless SQL Lifecycle Management](#serverless-sql-lifecycle-management)
  - [Ruby](#ruby)

Examples of managing the life cycle of database:

- Designing
- Development
- Operations
- Refactoring

Using infrastructure as code tools; and migration libraries from many coding languages

## Ruby

Setup the tools:

- Use activerecord
- Use standalone migrations
- Use strong migrations

Create a migration:

```
docker-compose run app bundle exec rake db:new_migration name=add_name_to_users
```
