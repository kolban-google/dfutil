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

Globals:

* `--project` - The project ID of the Dialog Flow hosting GCP project.


## Examples
### Create an intent

```
node index.js intent create --project my-project \
  --training-phrase "Order a pizza" \
  --response-text "Your order has been submitted"
```