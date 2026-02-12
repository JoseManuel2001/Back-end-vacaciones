const { getConnection } = require('../database/database.cjs')

export const validarOperacionEvaluacion = async (req, res, next) => {
    try {

        if (metodo === "GET") {
            return next()
        }
        const rol = req.headers["user-rol"]
        const metodo = req.method

        if (!rol) {
            return res.status(400).json({
                message: "User role not provided"
            })
        }

        const pool = await getConnection()
        const periodoResult = await pool
            .request()
            .query(`
            SELECT 1
            FROM vacaciones_sypris.periodos_evaluacion
            WHERE CAST(GETDATE() AS DATE)
                BETWEEN fecha_inicio AND fecha_fin
        `)

        const periodoActivo = periodoResult.recordset.length > 0

        if (periodoActivo) {
            return next()
        }

        if (metodo === "POST") {
            return res.status(403).json({
                message: "Evaluation period is closed. You do not have permissions."
            })
        }

        if (metodo === "PUT" || metodo === "DELETE") {
            if (rol === "Empleado" || rol === "Supervisor") {
                return res.status(403).json({
                    message: "Evaluation period is closed. You cannot modify evaluations."
                })
            }

            if (rol === "RH" || rol === "SupervisorRH") {

                const evaluacionId = req.params.id

                if (!evaluacionId) {
                    return res.status(400).json({
                        message: "Evaluation ID is required"
                    })
                }

                const evaluacionResult = await req.db.query(`
                    SELECT estatus
                    FROM vacaciones_syprisevaluaciones
                    WHERE id_evaluacion = @id
                `, {
                    id: evaluacionId
                })

                if (evaluacionResult.recordset.length === 0) {
                    return res.status(404).json({
                        message: "Evaluation not found"
                    })
                }

                if (evaluacionResult.recordset[0].estatus !== 3) {
                    return res.status(403).json({
                        message: "Only RH evaluations can be modified outside the evaluation period"
                    })
                }

                return next()
            }
        }

        return res.status(403).json({
            message: "Operation not allowed"
        })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
