import {Schema, Document, model, Model} from 'mongoose';
import * as uniqueValidator from "mongoose-unique-validator";
import {IPost} from './post.interface';

const SALT_WORK_FACTOR = 10;

/**
 * User Schema
 * @author Freeman Ogbiyoyo
 * @public
 */
export let PostSchema : Schema = new Schema({
  author: {
    type: String,
    default: ''
  },
  permlink : {
    type: String,
    default: null
  },
  postImage: {
    type: String,
    default: '',
    required:true
  },
  postTitle: {
    type: String,
    default: '',
    required:true
  },
  postDescription: {
    type: String,
    default: '',
    required:true
  },
  tags: {
    type: Array,
    default: ['fashlogue']
  },
  postedTo: {
    type: Array,
    default: ['fashlogue']
  },
  createdAt: {
    type: Date,
    default: new Date
  },
  modifiedAt: {
    type: Date,
    default: new Date
  }
});

PostSchema.plugin(uniqueValidator);


/**
 * PostShchemaDoc Interface
 * @author Freeman Ogbiyoyo
 * @public
 */

interface PostSchemaDoc extends IPost,
Document {
  
}

const PostModel : Model < PostSchemaDoc > = model < PostSchemaDoc > ('Post', PostSchema);
export default PostModel;