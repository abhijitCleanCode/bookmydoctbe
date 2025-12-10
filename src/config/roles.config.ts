export const RolePermissions = {
    superAdmin: [
        "verifyClinic",
        ""
    ],

    clinicOwner: [
        "manageDoctor",
        "manageAppointment",
        "manageClinicProfile",
        "" // paid service
    ],

    doctor: [
        "viewAppointment",
    ],

    user: [
        "viewAppointment",
    ],
}

export type Role = keyof typeof RolePermissions;
