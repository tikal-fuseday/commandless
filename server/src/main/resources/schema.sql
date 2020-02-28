CREATE TABLE keyword (
    id serial primary key,
    label varchar(36) unique not null
);

CREATE TABLE command (
    id serial primary key,
    bin varchar(128) not null,
    github varchar(128),
    resolution jsonb not null,
    inputs jsonb not null
);

CREATE TABLE recipe (
    id serial primary key,
    command_id integer not null references command(id),
    description text not null,
    inputs jsonb not null
);

CREATE TABLE keyword_recipe (
    id serial primary key,
    keyword_id integer not null references keyword(id),
    recipe_id integer not null references recipe(id)
);
