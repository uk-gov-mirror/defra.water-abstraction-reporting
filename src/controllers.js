const pkg = require('../package.json');
const { pool } = require('./lib/connectors/db');

const getStatus = async () => {
    try {
        const { rows: data } = await pool.query(`select 'WORLD' as HELLO FROM water.application_state;`);
        return {
            data,
            error: null,
            version: pkg.version
        };
    } catch (error) {
        return { error };
    }
}

exports.getStatus = getStatus;