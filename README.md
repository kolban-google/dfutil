# DialogFlow command line tool

This project is still a work in progress.  To use:

```
node index.js [COMMANDS]
```

The current commands are:

* `intent create`
  * `--display-name` - The name of the intent.
  * `--training-phrase` - The training phrase for the intent.
  * `--response-text` - The response text for the matching intent.

* `intent csv`
  * `--csv-file` - The name of a CSV file to import from.

Globals:

* `--project` - The project ID of the Dialog Flow hosting GCP project.


## CSV processing
A commong pattern is to create intents from CSV data.  The tool provides an `intent csv` command.  This will
read a named CSV file and for each line in the CSV, create an intent.  The first column will be used as the
training phrase while the second column will be used as the response text.  The first line of the CSV is
ignored assuming that it is a header line.  The display name for each intent will be the hex hash value
of the training phrase.


## Examples
### Create an intent

```
node index.js intent create --project my-project \
  --training-phrase "Order a pizza" \
  --response-text "Your order has been submitted"
```

```
node index.js intent csv --project my-project \
  --csv-file mydata.csv
```