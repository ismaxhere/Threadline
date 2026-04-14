// Generate unique IDs
export function makeId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

// Calculate nesting depth
export function calculateDepth(node, currentDepth = 0) {
  if (!node.replies || node.replies.length === 0) {
    return currentDepth;
  }
  return Math.max(...node.replies.map((reply) => calculateDepth(reply, currentDepth + 1)));
}

// Count total threads
export function countThreads(threads) {
  let count = threads.length;
  threads.forEach((thread) => {
    count += countAllReplies(thread);
  });
  return count;
}

// Count all replies recursively
export function countAllReplies(node) {
  let count = node.replies ? node.replies.length : 0;
  if (node.replies && node.replies.length > 0) {
    node.replies.forEach((reply) => {
      count += countAllReplies(reply);
    });
  }
  return count;
}

// Calculate mood distribution
export function getMoodDistribution(threads) {
  const distribution = { calm: 0, happy: 0, thoughtful: 0 };

  function traverse(node) {
    if (distribution.hasOwnProperty(node.mood)) {
      distribution[node.mood]++;
    }
    if (node.replies && node.replies.length > 0) {
      node.replies.forEach(traverse);
    }
  }

  threads.forEach(traverse);
  return distribution;
}

// Export threads as JSON
export function exportThreadsAsJSON(threads) {
  const dataStr = JSON.stringify(threads, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `threadline-${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

// Search threads
export function searchThreads(threads, query) {
  const lowerQuery = query.toLowerCase();
  const results = [];

  function traverse(node, parents = []) {
    if (node.text.toLowerCase().includes(lowerQuery)) {
      results.push({ ...node, parents });
    }
    if (node.replies && node.replies.length > 0) {
      node.replies.forEach((reply) => traverse(reply, [...parents, node]));
    }
  }

  threads.forEach((thread) => traverse(thread));
  return results;
}

// Filter threads by mood
export function filterByMood(threads, mood) {
  const results = [];

  function traverse(node) {
    if (node.mood === mood) {
      results.push(node);
    }
    if (node.replies && node.replies.length > 0) {
      node.replies.forEach(traverse);
    }
  }

  threads.forEach(traverse);
  return results;
}
