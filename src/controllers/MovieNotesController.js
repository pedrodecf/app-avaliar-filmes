const knex = require("../database/knex")

class MovieNotesController {
    async create (request, response) {
        const { title, description, rating, movie_tags } = request.body;

        const { user_id } = request.params;
        
        const  [movie_notes_id] = await knex("movie_notes").insert({
            title,
            description,
            rating,
            user_id
        })

        const tagsInsert = movie_tags.map(name => {
            return {
                movie_notes_id,
                user_id,
                name
            }
        });

        await knex("movie_tags").insert(tagsInsert);

        response.json();
    };

    async show (request, response) {
        const { id } = request.query;
        console.log(id)
        const movie_notes = await knex("movie_notes").where({ id }).first();
        const movie_tags = await knex("movie_tags").where({ movie_notes_id: id }).orderBy("name");        

        return response.json({
            ...movie_notes,
            movie_tags
        });

    };

    async delete (request, response) {
        const { id } = request.params;

        await knex("movie_notes").where({ id }).delete();

        return response.json()
    };

    async index (request, response) {
        const { user_id } = request.params;

        const { title, movie_tags } = request.query;

        let movie_notes;

        if (movie_tags) {
            const filterTags = movie_tags.split(',').map(movie_tags => movie_tags.trim());
            
            movie_notes = await knex("movie_tags")
            .select([
                "movie_notes.id",
                "movie_notes.title",
                "movie_notes.user_id",
            ])
            .where("movie_notes.user_id", user_id)
            .whereLike("movie_notes.title", `%${title}%`)
            .whereIn("name", filterTags)
            .innerJoin("movie_notes", "movie_notes.id", "movie_tags.movie_notes_id")     
            .orderBy("movie_notes.title")   

        } else {
        
        movie_notes = await knex("movie_notes")
            .where({ user_id })
            .whereLike("title", `%${title}%`)
            .orderBy("title");
        }

        const userTags = await knex("movie_tags").where({ user_id });

        const movieNotesWithTags = movie_notes.map(movie_notes => {
            const noteTags = userTags.filter(movie_tags => movie_tags.movie_notes_id === movie_notes.id);

            return {
                ...movie_notes,
                movie_tags: noteTags
            }
        })

        return response.json(movieNotesWithTags);
    }
}

module.exports = MovieNotesController;