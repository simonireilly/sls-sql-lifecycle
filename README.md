# When adopting serverless, there are many database options. Though there is likely a twin track to this decision.

- You need to decide between SQL and nosql
- You need to decide which database you will use after making decision 1.

So, for the purpose of this blog, let's assume we need SQL, probably for the following reasons:

- We aren't yet sure of our access patterns, and need the ability to dynamically reallocate indexes, and associations
- We have a great deal of experience operating SQL databases across many disciplines; architecture, development, and operations

Of course, one day our situation may change, but for now, let's proceed with SQL.

## SQL database lifecycle management

What is it, and why should we care. Well, let's just start by identifying the phases of implementing a SQL database.

1. Design - we need some tables, indexes, relations and a little knowledge around access patterns, but they need not be set in stone!
2. Development - taking a design, and implementing it is development. We'll check it works with some tests, probably by poking the database from our application layer.
3. Operating - now we have a database and we know our application talks to it. The operation piece encompasses
    1. Applying migrations
    2. Handling rollback
    3. Seeding the database
    4. Getting performance information from the database

If we use these phases as a set of requirements to evaluate practices and tools, we can arrive perhaps at something that looks like lifecycle management and enables our whole engineering team to contribute their respective value.

## Why the serverless?

Well, that's a good question. Really because none of the above is new, arguably it's 30 years old or more. But when implementing in the serverless paradigm, there aren't any strong conventions around this.

Let's take a look at a framework that got databases right.

# Ruby on rails, or rather, ActiveRecord

### Design

In ruby on rails we could:

- Write a migration file with up and down
- Add tools (gems) which ensured our migration followed reversible best practices
- Run our migrations, and by default get a dump of the latest schema (as SQL if configured)

This meant design could be implemented, with an entity relationship diagram (ERD). And the dumped SQL could be used to reconcile that everything was as expected. Super 👍

### Development

Of course development was a cinch. A checked in set of migrations gave developers a consistent experience. More gems (tools) enabled developers to:

- Create a model (arguably an implementation detail of the orm, but handy)
- Always have a local database
- Test against the database for integration tests, in local, and continuous integration (CI)
- Cleanup and teardown the database with a consistent cli tool in test, development, and production

### Operations

Now, let's talk deployment. If you were around for the heroku hayday then likely you were just used to `git push heroku`. This would build the app, then spin up a copy in a Dyno (virtual machine) to run the migrations.

```bash
rails db:migrate
```

Heroku ran migrations at release, and failed the release if the migrations threw an error, preventing the latest version of your software being released, but, probably leaving your database in a state that required manual intervention.

### Enough with the rails!

Sorry, there is a point to this.

I believe what rails does is a good model, battle tested by hundreds of thousands of applications.

I want to focus on the way/practice of this database management, and see if it can be applied to serverless environments. Then, look at which tools can help achieve this undifferentiated heavy lifting.

# Start with what you know

Ok, so, let's begin by assuming we will just use active record to migrate our database.

Let's say we will use postgres aurora flavour of Amazon RDS.

And we will be building an application that uses AWS lambda.

Let's agree, we want to be able to use all the `rails db:xxxx` commands, locally, and in the development environment (AWS).

We also want our migrations to run when we perform a release to the development environment (AWS).

Of course, additionally, we want our database and migrations to run locally, for integration testing.

## Development

- We will run a local postgres instance in docker
- We will have a local ruby docker image for running ruby code
- We will write rails migrations inside our source controlled repository
- We will run migrations and commit the dumped structure.sql file

## Integration

- We will declare an RDS instance using infrastructure as code tools
- We will package the rails cli and source code into a docker lambda function
- We will expose the rails cli over an API for running migrations and all other `rails db:xxxx` commands

## Deployment

We have options here to:

1. Run migrations using a cloudformation custom resource
2. Run migrations using a pre/post trigger mechanism

Maybe we have to consider a few things. With custom resources, viewing the logs can be tricky. Cloudformation is very opaque.

But, with a pre/post trigger, we may fail to migrate, but succeed to deploy something that depends on the migration.

Best practices are to just not write your code that way, and release changes to the database, as ignored columns. Then perform a separate release to turn on the feature.

## Operations

So, in operations, we might inspect the database. Look at the migration versions, and look at the schema. We may even look a little deeper at table data, and columns in the development environment. In production, we probably should only allow health check actions.

# Let the code begin

## Database Design

Let's begin with writing an ERD. I am going to use drawio, inside vscode, with its support for mermaid.

I could just use mermaid directly, and I also highly rate plantuml.

Any ERD I can commit to source control, will help. And if I can reconstitute the ERD from the dumped SQL and compare them, that would be a big win. Stay tuned...

## Adding active record and migrations

## Running migrations locally

## Deploying the code

I am going to use the aws-cdk, but there are other options

- Terraform
- Serverless framework
- Pulumi
- Cloudformation
- Serverless stack
- [Arc.codes](http://arc.codes), open js architect

The list goes on, at this point in time I use the one I know best, and that is aws-cdk.

Building the ruby lambda image

> https://docs.aws.amazon.com/lambda/latest/dg/ruby-image.html

When adopting serverless, there are many database options. Though there is likely a twin track to this decision.

- You need to decide between SQL and nosql
- You need to decide which database you will use after making decision 1.

So, for the purpose of this blog, let's assume we need SQL, probably for the following reasons:

- We aren't yet sure of our access patterns, and need the ability to dynamically reallocate indexes, and associations
- We have a great deal of experience operating SQL databases across many disciplines; architecture, development, and operations

Of course, one day our situation may change, but for now, let's proceed with SQL.

## SQL database lifecycle management

What is it, and why should we care. Well, let's just start by identifying the phases of implementing a SQL database.

1. Design - we need some tables, indexes, relations and a little knowledge around access patterns, but they need not be set in stone!
2. Development - taking a design, and implementing it is development. We'll check it works with some tests, probably by poking the database from our application layer.
3. Operating - now we have a database and we know our application talks to it. The operation piece encompasses
    1. Applying migrations
    2. Handling rollback
    3. Seeding the database
    4. Getting performance information from the database

If we use these phases as a set of requirements to evaluate practices and tools, we can arrive perhaps at something that looks like lifecycle management and enables our whole engineering team to contribute their respective value.

## Why the serverless?

Well, that's a good question. Really because none of the above is new, arguably it's 30 years old or more. But when implementing in the serverless paradigm, there aren't any strong conventions around this.

Let's take a look at a framework that got databases right.

# Ruby on rails, or rather, ActiveRecord

### Design

In ruby on rails we could:

- Write a migration file with up and down
- Add tools (gems) which ensured our migration followed reversible best practices
- Run our migrations, and by default get a dump of the latest schema (as SQL if configured)

This meant design could be implemented, with an entity relationship diagram (ERD). And the dumped SQL could be used to reconcile that everything was as expected. Super 👍

### Development

Of course development was a cinch. A checked in set of migrations gave developers a consistent experience. More gems (tools) enabled developers to:

- Create a model (arguably an implementation detail of the orm, but handy)
- Always have a local database
- Test against the database for integration tests, in local, and continuous integration (CI)
- Cleanup and teardown the database with a consistent cli tool in test, development, and production

### Operations

Now, let's talk deployment. If you were around for the heroku hayday then likely you were just used to `git push heroku`. This would build the app, then spin up a copy in a Dyno (virtual machine) to run the migrations.

```bash
rails db:migrate
```

Heroku ran migrations at release, and failed the release if the migrations threw an error, preventing the latest version of your software being released, but, probably leaving your database in a state that required manual intervention.

### Enough with the rails!

Sorry, there is a point to this.

I believe what rails does is a good model, battle tested by hundreds of thousands of applications.

I want to focus on the way/practice of this database management, and see if it can be applied to serverless environments. Then, look at which tools can help achieve this undifferentiated heavy lifting.

# Start with what you know

Ok, so, let's begin by assuming we will just use active record to migrate our database.

Let's say we will use postgres aurora flavour of Amazon RDS.

And we will be building an application that uses AWS lambda.

Let's agree, we want to be able to use all the `rails db:xxxx` commands, locally, and in the development environment (AWS).

We also want our migrations to run when we perform a release to the development environment (AWS).

Of course, additionally, we want our database and migrations to run locally, for integration testing.

## Development

- We will run a local postgres instance in docker
- We will have a local ruby docker image for running ruby code
- We will write rails migrations inside our source controlled repository
- We will run migrations and commit the dumped structure.sql file

## Integration

- We will declare an RDS instance using infrastructure as code tools
- We will package the rails cli and source code into a docker lambda function
- We will expose the rails cli over an API for running migrations and all other `rails db:xxxx` commands

## Deployment

We have options here to:

1. Run migrations using a cloudformation custom resource
2. Run migrations using a pre/post trigger mechanism

Maybe we have to consider a few things. With custom resources, viewing the logs can be tricky. Cloudformation is very opaque.

But, with a pre/post trigger, we may fail to migrate, but succeed to deploy something that depends on the migration.

Best practices are to just not write your code that way, and release changes to the database, as ignored columns. Then perform a separate release to turn on the feature.

## Operations

So, in operations, we might inspect the database. Look at the migration versions, and look at the schema. We may even look a little deeper at table data, and columns in the development environment. In production, we probably should only allow health check actions.

# Let the code begin

## Database Design

Let's begin with writing an ERD. I am going to use drawio, inside vscode, with its support for mermaid.

I could just use mermaid directly, and I also highly rate plantuml.

Any ERD I can commit to source control, will help. And if I can reconstitute the ERD from the dumped SQL and compare them, that would be a big win. Stay tuned...

## Adding active record and migrations

## Running migrations locally

## Deploying the code

I am going to use the aws-cdk, but there are other options

- Terraform
- Serverless framework
- Pulumi
- Cloudformation
- Serverless stack
- [Arc.codes](http://arc.codes), open js architect

The list goes on, at this point in time I use the one I know best, and that is aws-cdk.

Building the ruby lambda image

> https://docs.aws.amazon.com/lambda/latest/dg/ruby-image.html
