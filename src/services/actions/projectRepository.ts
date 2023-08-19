import Repository from "@/astractions/repository";
import Project from "@/models/Project";
import Encryption from "@/utilies/encryption";
import request from "@/utilies/request";

export default class ProjectRepository extends Repository<Project> {
    url = `/Projects?$filter=Active eq 'tYES'`;
    
    // specific key
    key = 'projects';

    async get<Project>(query?: string | undefined): Promise<Project[]> {
        const data = localStorage.getItem(this.key);
        if (data) {
            const projects = JSON.parse(Encryption.decrypt(this.key, data));
            return JSON.parse(projects);
        }

        const projects = await request('GET', this.url).then((res: any) => res?.data?.value);
        const enc = Encryption.encrypt(this.key, JSON.stringify(projects));
        localStorage.setItem(this.key, enc);

        return projects;
    }


    find<Project>(code: number | undefined | null): any {
        const data = localStorage.getItem(this.key);
        if (!data) return {};
        const projects: [] = JSON.parse(JSON.parse(Encryption.decrypt(this.key, data ?? '[]')));
        return projects.find((e: any) => e?.Code == code);
    }

    post(payload: any, isUpdate?: boolean | undefined, id?: any): Promise<Project> {
        throw new Error("Method not implemented.");
    }
    patch(id: any, payload: any): Promise<Project> {
        throw new Error("Method not implemented.");
    }

    delete(id: any): Promise<Project> {
        throw new Error("Method not implemented.");
    }
}