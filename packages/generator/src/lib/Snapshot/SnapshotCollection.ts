import type {
  PrismaModel,
  SnapshotCollection,
  SnapshotContext,
} from "@/generator/lib/Snapshot/SnapshotTypes";

const prismaModelToSnapshotCollection = (
  ctx: SnapshotContext,
  prismaModel: PrismaModel,
): SnapshotCollection => {
  if (
    prismaModel.primaryKey?.fields &&
    prismaModel.primaryKey.fields.length > 1
  ) {
    throw new Error(
      `[model=${prismaModel.name}] Composite primary keys are not supported`,
    );
  }
  const modelDirectives = ctx.getDirectivesOfPrismaModel(prismaModel);
  const accountability = modelDirectives.find(`accountability`)?.tArgs[0];
  const collectionTranslations = modelDirectives.filter(
    `collectionTranslation`,
  );
  const itemDuplicationFields = modelDirectives
    .filter(`itemDuplicationField`)
    .map((directive) => directive.tArgs[0]);
  const directusCollection: SnapshotCollection = {
    collection: prismaModel.dbName ?? prismaModel.name,
    meta: {
      accountability:
        accountability === `null` || accountability === undefined
          ? null
          : accountability,
      archive_app_filter:
        modelDirectives.find(`archiveAppFilter`) !== undefined ||
        modelDirectives.find(`archive`)?.kwArgs.filter === true,
      archive_field:
        modelDirectives.find(`archiveField`)?.tArgs[0] ??
        modelDirectives.find(`archive`)?.kwArgs.field ??
        null,
      archive_value:
        modelDirectives.find(`archiveValue`)?.tArgs[0] ??
        modelDirectives.find(`archive`)?.kwArgs.archive ??
        null,
      collapse: modelDirectives.find(`collapse`)?.tArgs[0] ?? `open`,
      collection: prismaModel.dbName ?? prismaModel.name,
      color: modelDirectives.find(`color`)?.tArgs[0] ?? null,
      display_template: modelDirectives.find(`template`)?.tArgs[0] ?? null,
      group: modelDirectives.find(`group`)?.tArgs[0] ?? null,
      hidden: modelDirectives.find(`hidden`) !== undefined,
      icon: modelDirectives.find(`icon`)?.tArgs[0] ?? null,
      item_duplication_fields:
        itemDuplicationFields.length > 0 ? itemDuplicationFields : null,
      note: modelDirectives.find(`note`)?.tArgs[0] ?? null,
      preview_url: modelDirectives.find(`previewUrl`)?.tArgs[0] ?? null,
      singleton: modelDirectives.find(`singleton`) !== undefined,
      sort: modelDirectives.find(`sort`)?.tArgs[0] ?? null,
      sort_field: modelDirectives.find(`sortField`)?.tArgs[0] ?? null,
      translations:
        collectionTranslations.length > 0
          ? collectionTranslations.map(({ tArgs }) => ({
              language: tArgs[0],
              plural: tArgs[3],
              singular: tArgs[2],
              translation: tArgs[1],
            }))
          : null,
      unarchive_value:
        modelDirectives.find(`unarchiveValue`)?.tArgs[0] ??
        modelDirectives.find(`archive`)?.kwArgs.unarchive ??
        null,
      versioning: modelDirectives.find(`versioning`) !== undefined,
    },
    schema: {
      name: prismaModel.dbName ?? prismaModel.name,
    },
  };

  return directusCollection;
};

export { prismaModelToSnapshotCollection };
