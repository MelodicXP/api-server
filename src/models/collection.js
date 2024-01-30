'use strict';

class Collection{
  constructor(model){
    this.model = model;
  }

  async create(json){
    try {
      const record = await this.model.create(json);
      return record;
    } catch(e){
      console.error('error in the collection interface');
      throw e;
    }
  }

  async read(id){
    try {
      // If no ID is provided, fetch all records
      const options = id ? { where: { id } } : {};
      const records = await this.model.findAll(options);

      // If ID is provided, expecting a single record
      if (id && records.length) {
        return records[0]; // Since findByPk would return a single object, mimic that by returning the first item of the array.
      }

      return records; // Return all records if no ID is provided, or an empty array if ID provided doesn't exist

    } catch (e) {
      console.error('Read error in the collection interface:', e);
      throw e; 
    }
  }

  async update(id, json){
    try {
      // Find record by id
      const record = await this.model.findOne({ where: { id } });
      if (record) {
        // update record with json data passed in (req.body)
        await record.update(json);
        return record;
      }
      return null;
    } catch (e) {
      console.error('Update error in the collection interface:', e);
      throw e;
    }
  }

  async delete(id){
    try {
      // Find record by id and delete
      const numDeleted = await this.model.destroy({ where: { id } });
      // return number of records deleted (should be 1 or 0 if no id found)
      return numDeleted;
    } catch (e) {
      console.error('Delete error in the collection interface:', e);
      throw e;
    }
  }
}

module.exports = Collection;