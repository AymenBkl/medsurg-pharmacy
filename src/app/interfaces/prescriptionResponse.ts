import { Prescription } from "./prescriptions";

export interface PrescriptionResponse {
    err: string;
    success: boolean;
    token: string;
    msg: string;
    status: number;
    prescription: Prescription;
}
