export const idlFactory = ({ IDL }) => {
  const CreateProjectArgs = IDL.Record({
    'name' : IDL.Text,
    'description' : IDL.Text,
    'target_amount' : IDL.Nat64,
  });
  const ProjectDetails = IDL.Record({
    'id' : IDL.Text,
    'status' : IDL.Text,
    'owner' : IDL.Principal,
    'name' : IDL.Text,
    'description' : IDL.Text,
    'created_at' : IDL.Nat64,
    'current_amount' : IDL.Nat64,
    'target_amount' : IDL.Nat64,
  });
  const Result = IDL.Variant({ 'Ok' : ProjectDetails, 'Err' : IDL.Text });
  return IDL.Service({
    'create_project' : IDL.Func([CreateProjectArgs], [Result], []),
    'fund_project' : IDL.Func([IDL.Text, IDL.Nat64], [Result], []),
    'get_all_projects' : IDL.Func([], [IDL.Vec(ProjectDetails)], ['query']),
    'get_project' : IDL.Func([IDL.Text], [Result], ['query']),
    'get_project_funds' : IDL.Func([IDL.Text], [IDL.Nat64], ['query']),
    'get_user_projects' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(ProjectDetails)],
        ['query'],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
