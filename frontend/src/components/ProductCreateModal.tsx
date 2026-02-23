

export default function ProductCreateModal(){

    return (
        <form>
            <label> Product Name:
                <input name="name" type="text"></input>
            </label>
            <label>
                <input name="description" type="text"></input>
            </label>
            <label> Price: 
                <input name="price" type="number"></input>
            </label>
            <label> Choose Category:
            <select name="categories" multiple>
                <option value="electronic">Electronic</option>
            </select>
            </label>
            <label> Upload Image
            <input type="file" name="image"></input>
            </label>
        </form>
    )

}