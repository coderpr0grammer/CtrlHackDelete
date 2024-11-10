import { IDL, query, update } from 'azle';

type Project = {
    id: string;
    name: string;
    totalFunds: bigint; // Track funds in ICP cycles
};

export default class {
    private projects: Record<string, Project> = {};

    // Method to fund a project
    @update([IDL.Text, IDL.Nat64])
    fundProject(projectId: string, amount: bigint): string {
        if (this.projects[projectId]) {
            this.projects[projectId].totalFunds += amount; // Add to existing funds
        } else {
            // If project does not exist, create it
            this.projects[projectId] = { id: projectId, name: `Project ${projectId}`, totalFunds: amount };
        }
        return `Funded ${amount} cycles to Project ${projectId}`;
    }

    // Query method to get the funding details for a project
    @query([IDL.Text], IDL.Opt(IDL.Record({ id: IDL.Text, name: IDL.Text, totalFunds: IDL.Nat64 })))
    getProjectFunds(projectId: string): Project | null {
        return this.projects[projectId] || null;
    }

    // Query method to retrieve all projects with funding details
    @query([], IDL.Vec(IDL.Record({ id: IDL.Text, name: IDL.Text, totalFunds: IDL.Nat64 })))
    getAllProjects(): Project[] {
        return Object.values(this.projects);
    }
}
