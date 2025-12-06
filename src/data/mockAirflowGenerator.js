export const generateMockDag = (dagId = 'generated_pipeline') => {
    const tasks = [];
    const layers = ['inbound', 'lake', 'mart', 'egress'];
    const taskCounts = { inbound: 2, lake: 3, mart: 4, egress: 2 };

    // Helper to get random task methods
    const getRandomMethod = (layer) => {
        const methods = {
            inbound: ['api_fetch', 'sftp_pull', 'db_extract', 'webhook_listen'],
            lake: ['s3_upload', 'gcs_load', 'write_parquet', 'archive_raw'],
            mart: ['dbt_run', 'spark_transform', 'sql_execute', 'data_quality_check'],
            egress: ['push_to_tableau', 'slack_notify', 'email_report', 'api_push']
        };
        const list = methods[layer];
        return list[Math.floor(Math.random() * list.length)];
    };

    let idCounter = 1;

    // Generate tasks for each layer
    const taskMap = {}; // layer -> [taskIds]

    layers.forEach(layer => {
        taskMap[layer] = [];
        const count = Math.ceil(Math.random() * 3) + 1; // 2 to 4 tasks per layer

        for (let i = 0; i < count; i++) {
            const method = getRandomMethod(layer);
            const taskId = `${layer}_${method}_${idCounter++}`;

            // Random state
            const states = ['success', 'success', 'success', 'running', 'failed', 'queued'];
            const state = states[Math.floor(Math.random() * states.length)];

            tasks.push({
                task_id: taskId,
                state: state,
                operator: method, // Simplified operator name
                duration: Math.random() * 1000,
                downstream_task_ids: []
            });
            taskMap[layer].push(taskId);
        }
    });

    // Link tasks between layers to create a DAG
    // Inbound -> Lake -> Mart -> Egress

    const linkLayers = (sourceLayer, targetLayer) => {
        const sourceTasks = taskMap[sourceLayer];
        const targetTasks = taskMap[targetLayer];

        sourceTasks.forEach(sourceId => {
            // Connect to 1-2 random targets
            const numTargets = Math.ceil(Math.random() * 2);
            for (let i = 0; i < numTargets; i++) {
                const targetId = targetTasks[Math.floor(Math.random() * targetTasks.length)];

                // Find the source task object to update its downstream
                const task = tasks.find(t => t.task_id === sourceId);
                if (!task.downstream_task_ids.includes(targetId)) {
                    task.downstream_task_ids.push(targetId);
                }
            }
        });
    };

    linkLayers('inbound', 'lake');
    linkLayers('lake', 'mart');
    linkLayers('mart', 'egress');

    return {
        dag_id: dagId,
        tasks: tasks
    };
};
