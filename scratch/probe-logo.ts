import probe from 'probe-image-size';
import fs from 'fs';

async function main() {
  const input = fs.createReadStream('d:/Project/lend/sakhi-lend/public/logo-sakhilend.png');
  const result = await probe(input);
  console.log(JSON.stringify(result));
}

main().catch(console.error);
