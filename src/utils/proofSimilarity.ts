import { PhotoProof } from '../types';
import { hammingDistance } from './imageHash';

export const SIMILAR_PROOF_DISTANCE_THRESHOLD = 8;

export interface SimilarProofMatch {
  proof: PhotoProof;
  distance: number;
}

/** Finds the closest stored hash without decoding any historical images. */
export function findSimilarProof(
  candidateHash: string,
  proofs: PhotoProof[],
  excludedProofId?: string | string[]
): SimilarProofMatch | undefined {
  const excludedSet = new Set(
    Array.isArray(excludedProofId) ? excludedProofId : (excludedProofId ? [excludedProofId] : [])
  );
  let closestMatch: SimilarProofMatch | undefined;

  for (const proof of proofs) {
    if (excludedSet.has(proof.id) || !proof.imageHash) continue;
    const distance = hammingDistance(candidateHash, proof.imageHash);
    if (distance === undefined || distance > SIMILAR_PROOF_DISTANCE_THRESHOLD) continue;
    if (!closestMatch || distance < closestMatch.distance) {
      closestMatch = { proof, distance };
    }
  }

  return closestMatch;
}
