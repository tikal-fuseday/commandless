CREATE TABLE keyword (
    id serial primary key,
    label varchar(36) unique not null
);

CREATE TABLE command (
    id serial primary key,
    inputs jsonb not null,
    bin varchar(128) not null,
    npm varchar(128),
    brew varchar(128),
    github varchar(128)
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


insert into keyword values(1, 'key0'), (2, 'key1');
insert into command (id, inputs, bin, npm, brew, github) values(1, '{}', 'mr.bin', 'mpn', null, 'www.gh.com'), (2, '{}', 'mrs.bina', 'npx', 'brew some beer', 'www.github.com');
insert into recipe (id, command_id, description, inputs) values (1, 1, 'Mock recipe0', '{}'), (2, 2, 'Mock recipe1', '{}')
insert into keyword_recipe (id, keyword_id, recipe_id) values (1, 1, 1), (2, 2, 1), (3, 2, 2);













/*

select id, command_id, description, inputs from recipe where id in(
    select distinct recipe_id from keyword_recipe where keyword_id  in(
        select id from keyword where label in ('key0', 'key1')
    )
)

insert into command (id, inputs, bin, npm, github) values (100, '{}', 'create-react-app',  'create-react-app', 'facebook/create-react-app')
*/