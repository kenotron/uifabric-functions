import * as vsts from 'vso-node-api';
import * as bi from 'vso-node-api/interfaces/BuildInterfaces';

const collectionUrl = "https://uifabric.visualstudio.com/defaultcollection";
const authHandler = vsts.getPersonalAccessTokenHandler(process.env!.VSTS_PAT!); 
const connection = new vsts.WebApi(collectionUrl, authHandler);  

export = async function (context, data) {
    if (data.action == 'opened' || data.action == 'synchronize') {
        const project = 'UI Fabric';

        const id = data.number;
        const ref = `refs/pull/${id}/merge`;

        const buildApi = await connection.getBuildApi();
        const defs: bi.DefinitionReference[] = await buildApi.getDefinitions(project);

        const def = defs.find(def => def.name == 'UI Fabric - PR Deploy');
        
        const build = await buildApi.queueBuild(<bi.Build>{
        definition: def!,
        sourceBranch: ref,
        }, project);

        
        context.res = { buildId: build.id };
    }
    context.done();
};