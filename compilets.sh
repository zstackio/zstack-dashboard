#!/bin/sh

cd ts
#files=`find -maxdepth 1 -type f -not -name "*.js"`
files="
api.ts
utils.ts
app.ts
sideBar.ts
nav.ts
zone.ts
cluster.ts
primaryStorage.ts
l2Network.ts
l3Network.ts
backupStorage.ts
host.ts
image.ts
instanceOffering.ts
diskOffering.ts
apiDetails.ts
vm.ts
volume.ts
securityGroup.ts
vip.ts
eip.ts
portForwarding.ts
virtualRouter.ts
virtualRouterOffering.ts
dashboard.ts
globalConfig.ts
directives.ts
"
echo "tsc --out app.js $files"
tsc --out app.js $files
cd - > /dev/null
yes | mv ts/app.js zstack_dashboard/static/app/app.js
