// import { User as UserInterface } from '../../interfaces/User.js';
import Pet from '../../models/Pet.js';
import Post from '../../models/Post.js';
import { errorHandler } from '../helpers/index.js';
const pet_resolvers = {
    Query: {
        //Get all posts
        async getAllPosts() {
            const posts = await Post.find().populate('pet');
            return posts;
        },
        // Get user pets
        async getUserPets(_, __, context) {
            if (!context.req.user) {
                return {
                    errors: ['You are not authorized to perform this action']
                };
            }
            const pets = await Pet.find({
                owner: context.req.user._id
            });
            return pets;
        },
        // Get pet posts
        async getPostForPet(_, args) {
            const posts = await Post.find({
                pet: args.pet_id
            });
            return posts;
        }
    },
    Mutation: {
        // Create a pet
        async createPet(_, args, context) {
            if (!context.req.user) {
                return {
                    errors: ['You are not authorized to perform this action']
                };
            }
            try {
                const pet = await Pet.create({
                    ...args,
                    owner: context.req.user._id
                });
                context.req.user.pets.push(pet._id);
                await context.req.user.save();
                return {
                    message: 'Pet added successfully!'
                };
            }
            catch (error) {
                return errorHandler(error);
            }
        },
        // Create a post for a pet
        async createPost(_, args, context) {
            if (!context.req.user) {
                return {
                    errors: ['You are not authorized to perform this action']
                };
            }
            try {
                //   await Post.create(args) 
                const post = await Post.create(args);
                await Pet.findByIdAndUpdate(args.pet, {
                    $push: {
                        posts: post._id
                    }
                });
                return {
                    message: 'Post created successfully!'
                };
            }
            catch (error) {
                return errorHandler(error);
            }
        }
    }
};
export default pet_resolvers;