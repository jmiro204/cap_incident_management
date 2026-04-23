const cds = require('@sap/cds')

class ProcessorService extends cds.ApplicationService {
    /** Registering custom event handlers */
    init() {
        this.before("UPDATE", "Incidents", (req) => this.onUpdate(req));
        this.before("CREATE", "Incidents", (req) => this.onCreate(req.data));
        this.after("READ", "Incidents", (req) => this.onReadIncidents(req));

        return super.init();
    }

    /** Custom Change Create */
    onCreate(data) {
        let urgent = data.title?.match(/urgent/i)
        if (urgent) data.urgency_code = 'H'
    }

    /** Custom Validation */
    async onUpdate(req) {
        let closed = await SELECT.one(1).from(req.subject).where`status.code = 'C'`
        if (closed) req.reject`Can't modify a closed incident!`
    }

    /* Virtual Field */
    onReadIncidents(data) {
        const incidents = Array.isArray(data) ? data : [data];
        incidents.forEach(incident => {
            incident.virtualf = 'Test Virtual';
        });
    }
}
module.exports = { ProcessorService }
