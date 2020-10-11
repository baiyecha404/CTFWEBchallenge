import {MongoClient} from 'https://deno.land/x/mongo/mod.ts';
import type {ObjectId} from 'https://deno.land/x/mongo/ts/types.ts';

const client = new MongoClient();
client.connectWithUri('mongodb://mongo:27017');

const mongo = client.database('milk');

export interface UserSchema {
  _id: ObjectId,
  username: string,
  password: string,
  admin: boolean,
}

export interface NoteSchema {
  _id: ObjectId,
  username: string,
  body: string,
}

export interface TokenSchema {
  _id: ObjectId,
  username: string,
  token: string,
}

export const Users = mongo.collection<UserSchema>('users');
export const Notes = mongo.collection<NoteSchema>('notes');
export const Tokens = mongo.collection<TokenSchema>('tokens');