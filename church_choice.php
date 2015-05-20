<form>
    <select name="church">
        <?php
        foreach ($aChurches as $sC)
        {
            ?><option value="<?= $sC; ?>"><?= $sC; ?></option>
        <?php } ?>
    </select>

    <input type="submit" value="Go" />
</form>
<?php
exit;


