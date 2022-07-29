import { Blob } from "@web-std/blob";
import all from 'it-all';
import { MemoryBlockStore } from "../blockstore/memory.js";
import { pack } from "./index.js";
export async function packToBlob({ input, blockstore: userBlockstore, hasher, maxChunkSize, maxChildrenPerNode, wrapWithDirectory, rawLeaves }) {
    const blockstore = userBlockstore ? userBlockstore : new MemoryBlockStore();
    const { root, out } = await pack({
        input,
        blockstore,
        hasher,
        maxChunkSize,
        maxChildrenPerNode,
        wrapWithDirectory,
        rawLeaves
    });
    const carParts = await all(out);
    if (!userBlockstore) {
        await blockstore.close();
    }
    const car = new Blob(carParts, {
        // https://www.iana.org/assignments/media-types/application/vnd.ipld.car
        type: 'application/vnd.ipld.car',
    });
    return { root, car };
}