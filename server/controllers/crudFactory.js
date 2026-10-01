  const slugify = value => String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function makeCrud(Model, label) {
  const one = label.replace(/ies$/, 'y').replace(/s$/, '');
  return {
    list: async (req, res, next) => {
      try {
        const all = req.query.all === '1' || req.query.includeUnavailable === '1' || req.query.includeInactive === '1';
        const filter = all ? {} : ['Branch', 'Category'].includes(Model.modelName) ? { isActive: true } : { isAvailable: true };
        let query = Model.find(filter).sort(Model.modelName === 'Category' ? { sortOrder: 1, name: 1 } : { createdAt: 1 });
        if (Model.modelName === 'Food') query = query.populate('category', 'name slug');
        const items = await query;
        return res.json({ [label]: items, count: items.length });
      } catch (error) {
        return next(error);
      }
    },
    getOne: async (req, res, next) => {
      try {
        let query = Model.findById(req.params.id);
        if (Model.modelName === 'Food') query = query.populate('category', 'name slug');
        const item = await query;
        if (!item) return res.status(404).json({ message: `${one} not found.` });
        return res.json({ [one]: item });
      } catch (error) {
        return next(error);
      }
    },
    create: async (req, res, next) => {
      try {
        const payload = { ...req.body };
        if (!payload.slug && payload.name) payload.slug = slugify(payload.name);
        const item = await Model.create(payload);
        return res.status(201).json({ [one]: item });
      } catch (error) {
        return next(error);
      }
    },
    update: async (req, res, next) => {
      try {
        const item = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!item) return res.status(404).json({ message: `${one} not found.` });
        return res.json({ [one]: item });
      } catch (error) {
        return next(error);
      }
    },
    remove: async (req, res, next) => {
      try {
        const item = await Model.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ message: `${one} not found.` });
        return res.json({ message: `${one} deleted.` });
      } catch (error) {
        return next(error);
      }
    },
  };
}

module.exports = { makeCrud, slugify };