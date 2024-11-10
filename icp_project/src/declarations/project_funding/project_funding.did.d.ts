import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface CreateProjectArgs {
  'name' : string,
  'description' : string,
  'target_amount' : bigint,
}
export interface ProjectDetails {
  'id' : string,
  'status' : string,
  'owner' : Principal,
  'name' : string,
  'description' : string,
  'created_at' : bigint,
  'current_amount' : bigint,
  'target_amount' : bigint,
}
export type Result = { 'Ok' : ProjectDetails } |
  { 'Err' : string };
export interface _SERVICE {
  'create_project' : ActorMethod<[CreateProjectArgs], Result>,
  'fund_project' : ActorMethod<[string, bigint], Result>,
  'get_all_projects' : ActorMethod<[], Array<ProjectDetails>>,
  'get_project' : ActorMethod<[string], Result>,
  'get_project_funds' : ActorMethod<[string], bigint>,
  'get_user_projects' : ActorMethod<[Principal], Array<ProjectDetails>>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
