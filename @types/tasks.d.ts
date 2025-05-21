export interface Task {
    id: number;
    title: string;
    message?: string;
    status: number;
    do_at: string;
    created_at: string;
}