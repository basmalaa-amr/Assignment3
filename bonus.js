var longestCommonPrefix = function(strs) {
    
    let curr = strs[0];

    for (let i = 0; i < strs.length - 1; i++) {
        let next = strs[i + 1];
        let result = "";

        for (let j = 0; j < Math.min(curr.length, next.length); j++) {
            if (curr[j] === next[j]) {
                result += curr[j];
            } else {
                break;
            }
        }

        curr = result;
    }

    return curr;
};