export default function searchFilter(list, searchKey, field) {
    return list.filter(item => item[field] && item[field].toLowerCase().includes(searchKey.toLowerCase()))
}